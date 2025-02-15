import React from "react";
import Swal from "sweetalert2";

const TaskCard = ({ task, onEdit, onDelete }) => {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You won't be able to revert this!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      onDelete(task.id); // Call onDelete function passed from TaskManager
      Swal.fire("Deleted!", "Your task has been deleted.", "success");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
      <h2 className="text-xl font-semibold text-gray-800">{task.title}</h2>
      <p className="text-gray-600 mt-2">{task.description}</p>
      <p className="text-gray-500 mt-2">
        Due: {new Date(task.due_date).toLocaleString()}
      </p>
      <p className="text-gray-500 mt-2">Assigned to: {task.assigned_user}</p>
      <p className="text-gray-500 mt-2">Status: {task.status}</p>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => onEdit(task)}
          className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition-all duration-300"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white p-2 ml-2 rounded-md hover:bg-red-600 transition-all duration-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
