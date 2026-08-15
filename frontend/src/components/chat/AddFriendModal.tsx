import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { UserPlus } from "lucide-react"
import type { User } from "@/types/user";
import { useFriendStore } from "@/stores/useFriendStore";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import SearchForm from "../addFriendModal/searchForm";
import SendFriendRequestForm from "../addFriendModal/sendFriendRequestForm";

export interface IFormValues {
  username: string,
  message: string,
}

const AddFriendModal = () => {
  // ba trạng thái: null: chưa tìm thấy, false: không tồn tại, true: tìm thấy
  const [isFound, setIsFound] = useState<boolean | null>(null); 
  // thông tin user tìm được
  const [searchUser, setSearchUser] = useState<User>();
  // username đã được search, hiển thị trong ui (đã tìm thấy hoặc kh tìm thấy)
  const [searchedUsername, setSearchedUsername] = useState("");
  const { loading, searchByUsername, addFriend } = useFriendStore();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IFormValues>({
    defaultValues: {
      username: "",
      message: "",
    }
  })

  // hàm watch kiểm tra input và lấy giá trị real time, khi reset form thì giá trị cx reset 
  const usernameValue = watch("username");

  // viết lại hàm handleSubmit từ useForm thì khi truyền chỉ cần đưa handleSearch 
  const handleSearch = handleSubmit(async (data) => {
    const username = data.username.trim();
    if (!username) return;

    setIsFound(null);
    // dùng để hiển thị username khi ko tìm dc, ...
    setSearchedUsername(username);

    try {
      const foundUser = await searchByUsername(username);
      if (foundUser) {
        setIsFound(true);
        // user đúng tìm đc 
        setSearchUser(foundUser);
      } else {
        setIsFound(false);
      }
    } catch (error) {
      console.error(error);
      setIsFound(false);
    }
  });

   const handleSend = handleSubmit(async (data) => {
    if (!searchUser) return;

    try {
      const message = await addFriend(searchUser._id, data.message.trim());
      toast.success(message);

      handleCancel();
    } catch (error) {
      console.error("Lỗi xảy ra khi gửi request từ form", error);
    }
  });

  const handleCancel = () => {
    reset();
    setSearchedUsername("");
    setIsFound(null);
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <div className="flex justify-center items-center size-5 rounded-full hover:bg-sidebar-accent cursor-pointer z-10" />
        }
      >
        <UserPlus className="size-4" />
        <span className="sr-only">Kết bạn</span>
      </DialogTrigger>
        
      <DialogContent>
        <DialogHeader className="sm:max-w-[425px] border-none">
          <DialogTitle>kết bạn</DialogTitle>
        </DialogHeader>

        {!isFound &&
          <>
            <SearchForm
            register={register}
            errors={errors}
            usernameValue={usernameValue}
            loading={loading}
            isFound={isFound}
            searchedUsername={searchedUsername}
            onSubmit={handleSearch}
            onCancel={handleCancel}
          />
          </>
        }

        {isFound && 
          <>
            <SendFriendRequestForm
              register={register}
              loading={loading}
              searchedUsername={searchedUsername}
              onSubmit={handleSend}
              onBack={() => setIsFound(null)}
            />
          </>
        }
      </DialogContent>
      
    </Dialog>
  )
}

export default AddFriendModal