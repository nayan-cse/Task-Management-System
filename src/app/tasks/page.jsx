"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TaskList from "../components/TaskList";
import TaskModal from "../components/TaskModal";
import LogoutButton from "../components/logout";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    due_date: "",
    assigned_user: "",
    status: "Pending",
  });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0,
    limit: 5,
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 5;
    fetchTasks(page, limit);
  }, [searchParams]);

  const fetchTasks = async (page = 1, limit = 5) => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`/api/v1/tasks?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setLoading(false);
    if (res.status === 401) {
      router.push("/login");
    } else if (res.status === 200) {
      setTasks(data.tasks || []);
      setPagination({
        currentPage: data.page,
        totalPages: data.totalPages,
        totalTasks: data.totalTasks,
        limit: data.limit,
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: data.error || "Something went wrong while fetching tasks",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      const params = new URLSearchParams(searchParams);
      params.set("page", newPage.toString());
      params.set("limit", pagination.limit.toString());
      router.push(`/tasks?${params.toString()}`);
    }
  };

  const handleLimitChange = (event) => {
    const newLimit = parseInt(event.target.value);
    setPagination((prev) => ({ ...prev, limit: newLimit }));
    const params = new URLSearchParams(searchParams);
    params.set("limit", newLimit.toString());
    params.set("page", "1");
    router.push(`/tasks?${params.toString()}`);
    fetchTasks(1, newLimit);
  };

  const handleCreateTask = async () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    const res = await fetch("/api/v1/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });
    const data = await res.json();
    setLoading(false);
    if (res.status === 200) {
      Swal.fire({
        title: "Success!",
        text: "Task created successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      setTaskData({
        title: "",
        description: "",
        due_date: "",
        assigned_user: "",
        status: "Pending",
      });
      setShowModal(false);
      fetchTasks(pagination.currentPage, pagination.limit);
    } else {
      Swal.fire({
        title: "Error!",
        text: data.error || "Something went wrong!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleUpdateTask = async () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`/api/v1/tasks/${selectedTask.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });
    const data = await res.json();
    setLoading(false);
    if (res.status === 200) {
      Swal.fire({
        title: "Success!",
        text: "Task updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      setSelectedTask(null);
      setTaskData({
        title: "",
        description: "",
        due_date: "",
        assigned_user: "",
        status: "Pending",
      });
      setShowModal(false);
      fetchTasks(pagination.currentPage, pagination.limit);
    } else {
      Swal.fire({
        title: "Error!",
        text: data.error || "Something went wrong!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDeleteTask = async (id) => {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`/api/v1/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (res.status === 200) {
      Swal.fire({
        title: "Deleted!",
        text: "Task deleted successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      if (tasks.length === 1 && pagination.currentPage > 1) {
        handlePageChange(pagination.currentPage - 1);
      } else {
        fetchTasks(pagination.currentPage, pagination.limit);
      }
    } else {
      Swal.fire({
        title: "Error!",
        text: data.error || "Something went wrong!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to logout",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("accessToken");
        router.push("/login");
        Swal.fire(
          "Logged out!",
          "You have been logged out successfully.",
          "success"
        );
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 transition-all duration-300 hover:text-blue-600">
          Task Management
        </h1>
        <div className="flex items-center gap-4">
          <select
            value={pagination.limit}
            onChange={handleLimitChange}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value={5}>5 tasks per page</option>
            <option value={10}>10 tasks per page</option>
            <option value={15}>15 tasks per page</option>
          </select>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white p-3 rounded-md shadow-md hover:bg-blue-600 transition-all duration-300"
          >
            Create New Task
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-3 rounded-md shadow-md hover:bg-red-600 transition-all duration-300"
        >
          Logout
        </button>
      </div>

      {/* Centered spinner */}
      {loading && (
        <div className="flex justify-center items-center w-full h-full absolute bg-white bg-opacity-50 z-50">
          <ClipLoader color={"#000"} loading={loading} size={50} />
        </div>
      )}

      <TaskList
        tasks={tasks}
        setSelectedTask={setSelectedTask}
        setTaskData={setTaskData}
        setShowModal={setShowModal}
        handleDeleteTask={handleDeleteTask}
      />

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          Showing page {pagination.currentPage} of {pagination.totalPages} (
          {pagination.totalTasks} total tasks)
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              pagination.currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            } transition-all duration-300`}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className={`px-4 py-2 rounded-md ${
              pagination.currentPage === pagination.totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            } transition-all duration-300`}
          >
            Next
          </button>
        </div>
      </div>

      {showModal && (
        <TaskModal
          taskData={taskData}
          setTaskData={setTaskData}
          loading={loading}
          setShowModal={setShowModal}
          handleCreateTask={handleCreateTask}
          handleUpdateTask={handleUpdateTask}
          selectedTask={selectedTask}
        />
      )}
    </div>
  );
};

export default TaskManager;
