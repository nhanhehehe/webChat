import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30s";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    //required?
    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({
        message:
          "không thể thiếu username, password, email, firstName, lastName",
      });
    }

    // username exist?
    const duplicateUsername = await User.findOne({ username });

    if (duplicateUsername) {
      return res.status(409).json({ message: "username đã tồn tại" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10); // salt = 10 - trộn 2 mũ 10 lần

    await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });

    //return
    return res.sendStatus(204);
  } catch (error) {
    console.log("lỗi khi signUp", error);
    return res.status(500).json({
      message: "lỗi hệ thống",
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Thiếu username hoặc password." });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        message: "username hoặc password không chính xác",
      });
    }

    const passwordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordValid) {
      return res.status(401).json({
        message: "username hoặc password không chính xác",
      });
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_TTL,
      },
    );

    const refreshToken = crypto.randomBytes(64).toString("hex");

    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
    });

    return res.status(200).json({
      message: `User ${user.displayName} da log in!`,
      accessToken,
    });
  } catch (error) {
    console.error("lỗi khi signIn", error);
    return res.status(500).json({
      message: "lỗi hệ thống",
    });
  }
};

export const signOut = async (req, res) => {
  try {
    // lấy refreshToken từ cookie dùng cookie Parser để đọc cookie
    const token = req.cookies?.refreshToken;

    if (token) {
      // xóa refreshToken trong session db
      await Session.deleteOne({ refreshToken: token });

      // xóa cookie trên trình duyệt
      res.clearCookie("refreshToken");
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("lỗi khi gọi sign out", error);
    return res.stattus(500).json({
      message: "lỗi hệ thống",
    });
  }
};

export const refreshMe = async (req, res) => {
  try {
    // lấy refresh token từ cookie
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "refresh token không tồn tại",
      });
    }

    // kiểm tra có refresh token
    const session = await Session.findOne({ refreshToken });

    if (!session) {
      return res.status(403).json({
        message: "refresh token đã expire hoặc không hợp lệ",
      });
    }

    // kiểm tra có expire
    if (session.expiresAt < Date.now()) {
      return res.status(403).json({
        message: "refresh token đã expire ",
      });
    }

    //tạo access token
    const accessToken = jwt.sign(
      { userId: session.userId},
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_TTL,
      },
    );

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("lỗi khi refesh! ", error);
    res.status(500).json({
      message: "lỗi hệ thống",
    });
  }
};
