"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TaskList from "../components/TaskList";
import TaskModal from "../components/TaskModal";
import LogoutButton from "../components/logout";
import Swal from "sweetalert2";

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
  const router = useRouter();

  // Fetch tasks from the API
  const fetchTasks = async () => {
    const token = localStorage.getItem("accessToken");
    const res = await fetch("/api/v1/tasks", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (res.status === 401) {
      router.push("/login");
    } else if (res.status === 200) {
      setTasks(data.tasks || []);
    } else {
      alert(data.error || "Something went wrong while fetching tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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
      fetchTasks(); // Fetch tasks after creating a new one
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
      fetchTasks(); // Fetch tasks after updating one
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
      fetchTasks(); // Fetch tasks after deleting one
    } else {
      Swal.fire({
        title: "Error!",
        text: data.error || "Something went wrong!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 transition-all duration-300 hover:text-blue-600">
          Task Management
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white p-3 rounded-md shadow-md hover:bg-blue-600 transition-all duration-300"
        >
          Create New Task
        </button>
        <LogoutButton />
      </div>

      <TaskList
        tasks={tasks}
        setSelectedTask={setSelectedTask}
        setTaskData={setTaskData}
        setShowModal={setShowModal}
        handleDeleteTask={handleDeleteTask}
      />

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
