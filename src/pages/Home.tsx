import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SkeletonLoader from "./SkeletonLoader";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface UserFormInputs {
  name: string;
  email: string;
  phone: string;
}

const Home: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UserFormInputs>();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get<User[]>(
          "https://jsonplaceholder.typicode.com/users"
        );
        setUsers(response.data);
        toast.success("Users loaded successfully!");
      } catch (err) {
        toast.error("Failed to fetch users.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Open Drawer for Create or Edit mode
  const openDrawer = (mode: "create" | "edit", user?: User) => {
    setDrawerMode(mode);
    if (mode === "edit" && user) {
      setCurrentUser(user);
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("phone", user.phone);
      reset(); 
    } else {
      reset(); 
    }
    setDrawerOpen(true);
  };

  // Close Drawer
  const closeDrawer = () => {
    setDrawerOpen(false);
    setCurrentUser(null);
  };

  // Create or Edit user
  const onSubmit: SubmitHandler<UserFormInputs> = async (data) => {
    try {
      if (drawerMode === "create") {
        const response = await axios.post<User>(
          "https://jsonplaceholder.typicode.com/users",
          data
        );
        setUsers([...users, response.data]);
        toast.success("User created successfully!");
      } else if (currentUser) {
        await axios.put(
          `https://jsonplaceholder.typicode.com/users/${currentUser.id}`,
          data
        );
        const updatedUsers = users.map((user) =>
          user.id === currentUser.id ? { ...user, ...data } : user
        );
        setUsers(updatedUsers);
        toast.success("User updated successfully!");
      }
    } catch (err) {
      toast.error("Failed to save user.");
      console.error(err);
    } finally {
      closeDrawer();
    }
  };

  // Delete user
  const handleDelete = async (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(
          `https://jsonplaceholder.typicode.com/users/${userId}`
        );
        setUsers(users.filter((user) => user.id !== userId));
        toast.success("User deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete user.");
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 mx-auto">User Management System</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => openDrawer("create")}
      >
        Create User
      </button>

      {loading ? (
        <SkeletonLoader/>
      ) : (
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Phone</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="border border-gray-300 p-2">{user.name}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">{user.phone}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => openDrawer("edit", user)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Drawer for creating or editing user*/}
      {isDrawerOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">
              {drawerMode === "create" ? "Create User" : "Edit User"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Name</label>
                <input
                  className="border border-gray-300 p-2 w-full rounded"
                  {...register("name", { required: true, minLength: 3 })}
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">
                    Name is required and must be at least 3 characters.
                  </span>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Email</label>
                <input
                  className="border border-gray-300 p-2 w-full rounded"
                  type="email"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    Email is required.
                  </span>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Phone</label>
                <input
                  className="border border-gray-300 p-2 w-full rounded"
                  {...register("phone", { required: true })}
                />
                {errors.phone && (
                  <span className="text-red-500 text-sm">
                    Phone is required.
                  </span>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={closeDrawer}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {drawerMode === "create" ? "Create" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Home;
