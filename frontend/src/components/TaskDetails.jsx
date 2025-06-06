"use client";
import { formatDate } from "@/lib/utils";
import { Badge } from "./ui/badge";
import {
  BadgeAlertIcon,
  CalendarPlusIcon,
  CalendarSyncIcon,
  UserCircleIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  SelectContent,
  SelectItem,
  Select,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { formatDateApi } from "@/lib/utils";
import Toast from "@/lib/Toast";
import { updateTask } from "@/features/taskSlice";
import { hideLoader, showLoader } from "@/features/loaderSlice";

export default function TaskDetail({ task }) {
  const [date, setDate] = useState(new Date(task.due_date));
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");

  const [selectedPriority, setSelectedPriority] = useState(
    task.priority || "low"
  );
  const fieldNames = {
    title: "Title",
    description: "Description",
    due_date: "Due Date",
    priority: "Priority",
    status: "Status",
  };
  const [selectedStatus, setSelectedStatus] = useState(task.status || "todo");
  const prevTitle = useRef(task.title);
  const prevDescription = useRef(task.description);
  const { error: taskError, loading: taskLoading } = useSelector(
    (state) => state.task
  );

  const dispatch = useDispatch();

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     const taskData = {
  //       title: title,
  //       description: description,
  //       due_date: formatDateApi(date, false, true),
  //       priority: selectedPriority,
  //       status: selectedStatus
  //     };
  //       console.log("Task Data:", taskData);

  //     const result = await dispatch(updateTask(taskData));
  //     if (updateTask.fulfilled.match(result)) {
  //       if (result.payload.success) {
  //         Toast.success(result.payload.message || "Task updated");
  //       }
  //     }
  //   };

  const updateTaskApi = async (key, value) => {
    var taskData = {
      taskId: task.id,
      key,
      value,
    };
    if (key === "title") {
      setTitle(value);
      prevTitle.current = value;
    }
    if (key === "description") {
      setDescription(value);
      prevDescription.current = value;
    }
    if (key === "due_date") {
      setDate(value);
      taskData.value = formatDateApi(value, false, true);
    }
    const result = await dispatch(updateTask(taskData));
    if (updateTask.fulfilled.match(result)) {
      if (result.payload.success) {
        const msg = fieldNames[key];
        Toast.success(msg + " updated successfully");
      }
    }
  };

  const handlePriorityChange = (value) => {
    setSelectedPriority(value);
    updateTaskApi("priority", value);
  };
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    updateTaskApi("status", value);
  };

  useEffect(() => {
    if (taskLoading) {
      dispatch(showLoader());
    } else {
      dispatch(hideLoader());
    }
  }, [taskLoading]);

  useEffect(() => {
    if (taskError) {
      Toast.error(taskError);
    }
  }, [taskError]);

  const updateTitle = (value) => {
    if (prevTitle.current !== value) {
      updateTaskApi("title", value);
    }
  };
  const updateDescription = (value) => {
    if (prevDescription.current !== value) {
      updateTaskApi("description", value);
    }
  };
  return (
    <>
      {!task.can_edit && (
        <div className="min-h-screen">
          <h1 className="text-2xl font-bold mt-10 mb-2">{task.title}</h1>
          <hr className="mb-6" />
          <p className="mt-2 text-lg text-pre-line">{task.description}</p>
          <div className="p-4 bg-gray-25 shadow-lg border-1 dark:bg-gray-800 rounded-lg mt-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2 md:col-span-2">
                <h2 className="font-bold">Due date</h2>
                <p className="flex items-center">
                  <CalendarSyncIcon className="inline-block mr-2" />
                  {formatDate(task.due_date)}
                </p>
              </div>
              <div className="col-span-2 md:col-span-2">
                <h2 className="font-bold">Added on</h2>
                <p className="flex items-center">
                  <CalendarPlusIcon className="inline-block mr-2" />
                  {formatDate(task.created_at)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="col-span-2 md:col-span-2">
                <h2 className="font-bold">Status</h2>
                <div>
                  {task.status === "in_progress" && (
                    <Badge className="bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60 shadow-none rounded-full">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2" />{" "}
                      IN PROGRESS
                    </Badge>
                  )}

                  {task.status === "todo" && (
                    <Badge className="bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 text-red-500 border-red-600/60 shadow-none rounded-full">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2" />{" "}
                      TO-DO
                    </Badge>
                  )}
                  {task.status === "done" && (
                    <Badge className="bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" />{" "}
                      DONE
                    </Badge>
                  )}
                </div>
              </div>
              <div className="col-span-2 md:col-span-2">
                <h2 className="font-bold">Priority</h2>
                <div>
                  {task.priority === "high" && (
                    <Badge className="bg-red-500 text-white">
                      <BadgeAlertIcon className="w-4 h-4" />
                      HIGH
                    </Badge>
                  )}
                  {task.priority === "medium" && (
                    <Badge className="bg-amber-500 text-white">
                      <BadgeAlertIcon className="w-4 h-4" />
                      MEDIUM
                    </Badge>
                  )}
                  {task.priority === "low" && (
                    <Badge className="bg-green-500 text-white">
                      <BadgeAlertIcon className="w-4 h-4" />
                      LOW
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <hr className="mt-4" />
            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="col-span-2 md:col-span-2">
                <h2 className="font-bold">Assigned to</h2>
                <p className="flex items-center">
                  <UserCircleIcon className="inline-block mr-2" />
                  {task.assigned_user}
                </p>
              </div>
              <div className="col-span-2 md:col-span-2">
                <h2 className="font-bold">Added by</h2>
                <p className="flex items-center">
                  <UserCircleIcon className="inline-block mr-2" />
                  {task.created_by}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {task.can_edit && (
        <div className="flex min-h-screen">
          <form className="w-full rounded-lg">
            <h1 className="text-2xl font-bold mt-10 mb-2">UPDATE TASK</h1>
            <hr className="mb-6" />
            <div className="max-w-3xl">
              <div className="mb-4">
                <Label htmlFor="taskTitle" className="block text-md">
                  Title *
                </Label>
                <Input
                  id="taskTitle"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength="100"
                  className="mt-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter task title"
                  required
                  onBlur={(e) => updateTitle(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <Label
                  htmlFor="taskDescription"
                  className="block  text-md text-gray-700"
                >
                  Description
                </Label>
                <Textarea
                  id="taskDescription"
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  maxLength="500"
                  value={description}
                  className="mt-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter task description"
                  onBlur={(e) => updateDescription(e.target.value)}
                ></Textarea>
              </div>
              <div className="mb-4 flex gap-4 items-center">
                <Label className=" text-md text-gray-700 min-w-30">
                  Due Date
                </Label>
                <DatePicker
                  selected={new Date(date)}
                  minDate={new Date()}
                  onChange={(date) => {
                    updateTaskApi("due_date", date);
                  }}
                  dateFormat="dd-MMM-YYYY"
                  placeholderText="Select due date"
                  className="shadow-md p-2 block w-full rounded-md border-solid border-1 border-gray-300 max-w-50"
                />
              </div>
              <div className="mb-4 flex gap-4">
                <Label className="block text-sm  text-md text-gray-700 min-w-30">
                  Priority
                </Label>
                <RadioGroup
                  onValueChange={handlePriorityChange}
                  defaultValue={selectedPriority}
                  className="md:flex space-x-6  text-md"
                  aria-label="Choose an option"
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="low" id="r1" />
                    <Label htmlFor="r1" className="text-md">
                      Low
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="medium" id="r2" />
                    <Label htmlFor="r2" className="text-md">
                      Medium
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="high" id="r3" />
                    <Label htmlFor="r3" className="text-md">
                      High
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="mb-4 flex gap-4 items-center">
                <Label
                  className={"block text-sm text-md text-gray-700  min-w-30"}
                >
                  Status
                </Label>
                <Select
                  value={selectedStatus}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-[180px]" defaultValue="todo">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-4 flex gap-4 items-center">
                <Label className="block text-sm text-md text-gray-700  min-w-30">
                  Assigned to
                </Label>
                <Label className="text-md">{task.assigned_user}</Label>
              </div>

              {/* <Button
                type="submit"
                className="rounded-md bg-blue-600 px-10 mt-6 py-2 text-white md:w-auto w-full "
              >
                UPDATE
              </Button> */}
            </div>
          </form>
        </div>
      )}
    </>
  );
}
