import React from "react";

const TaskList = ({
  tasks,
  setSelectedTask,
  setTaskData,
  setShowModal,
  handleDeleteTask,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
        >
          <h2 className="text-xl font-semibold text-gray-800">{task.title}</h2>
          <p className="text-gray-600 mt-2">{task.description}</p>
          <p className="text-gray-500 mt-2">
            Due: {new Date(task.due_date).toLocaleString()}
          </p>
          <p className="text-gray-500 mt-2">
            Assigned to: {task.assigned_user}
          </p>
          <p className="text-gray-500 mt-2">Status: {task.status}</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => {
                setSelectedTask(task);
                setTaskData({
                  title: task.title,
                  description: task.description,
                  due_date: task.due_date,
                  assigned_user: task.assigned_user,
                  status: task.status,
                });
                setShowModal(true);
              }}
              className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition-all duration-300"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="bg-red-500 text-white p-2 ml-2 rounded-md hover:bg-red-600 transition-all duration-300"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
