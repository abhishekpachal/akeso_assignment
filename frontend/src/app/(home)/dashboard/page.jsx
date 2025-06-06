"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { deleteTask, getMyTasks } from "@/features/taskSlice";
import { formatDate, formatDateApi } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import {
  AlertCircleIcon,
  BadgeAlertIcon,
  CalendarPlusIcon,
  CalendarSyncIcon,
  UserCircleIcon,
  CalendarIcon,
  EditIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";

import { format } from "date-fns";
import "react-date-range/dist/styles.css"; // main style
import "react-date-range/dist/theme/default.css"; // theme style

import { hideLoader, showLoader } from "@/features/loaderSlice";
import Toast from "@/lib/Toast";

export default function DashboardPage() {
  const [priorities, setPriorities] = useState(["high", "medium", "low"]);
  const [taskStatus, setTaskStatus] = useState(["todo", "in_progress", "done"]);
  const statusNames = {
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done",
  };
  const [range, setRange] = useState([
    {
      startDate: addDays(new Date(), -30),
      endDate: addDays(new Date(), +10),
      key: "selection",
    },
  ]);

  const formattedRange = `${format(
    range[0].startDate,
    "LLL dd, yyyy"
  )} - ${format(range[0].endDate, "LLL dd, yyyy")}`;

  const dispatch = useDispatch();
  const { myTasks, loading, error } = useSelector((state) => state.task);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const filterDueDateStart = formatDateApi(range[0].startDate, true, false);
    const filterDueDateEnd = formatDateApi(range[0].endDate, false, true);
    dispatch(
      getMyTasks({
        filterPriority: priorities,
        filterStatus: taskStatus,
        filterDueDateStart,
        filterDueDateEnd,
      })
    ).finally(() => {
      initRef.current = false;
    });
  }, [[priorities], [taskStatus], range]);

  useEffect(() => {
    if (loading) {
      dispatch(showLoader());
    } else {
      dispatch(hideLoader());
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      Toast.error(error);
    }
  }, [error]);

  const handlePriorityChange = (priority) => {
    setPriorities((prev) =>
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority]
    );
  };

  const handleTaskStatusChange = (status) => {
    setTaskStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const taskDelete = async (taskId) => {
    const result = await dispatch(deleteTask(taskId));
    if (deleteTask.fulfilled.match(result)) {
      if (result.payload.success) {
        Toast.success(result.payload.message || "Task deleted successfully");
        const filterDueDateStart = formatDateApi(
          range[0].startDate,
          true,
          false
        );
        const filterDueDateEnd = formatDateApi(range[0].endDate, false, true);
        dispatch(
          getMyTasks({
            filterPriority: priorities,
            filterStatus: taskStatus,
            filterDueDateStart,
            filterDueDateEnd,
          })
        );
      }
    } else {
      Toast.error("An error occurred while deleting the task");
    }
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold mt-10 mb-2">MY TASKS</h1>
      <hr className="mb-6" />
      <div className="grid grid-cols-15 mb-6 gap-6">
        <div className="col-span-10 md:col-span-1">
          <Label className="text-xl font-medium">Filters</Label>
        </div>
        <div className="col-span-12 md:col-span-3 text-center">
          <Popover className="shadow-lg">
            <PopoverTrigger asChild>
              <Button variant="outline" className="shadow-sm border-gray-300">
                Due Date <CalendarIcon className="h-4 w-4" />
                {formattedRange}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="p-0 border-none shadow-xl">
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={range}
                months={2}
                direction="horizontal"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="col-span-12 md:col-span-3 md:text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shadow-sm border-gray-300">
                Priority{" "}
                <span className="text-blue-500">
                  ({priorities.join(", ").toLocaleUpperCase()})
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Priority</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={priorities.includes("high")}
                onCheckedChange={() => handlePriorityChange("high")}
              >
                High
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={priorities.includes("medium")}
                onCheckedChange={() => handlePriorityChange("medium")}
              >
                Medium
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={priorities.includes("low")}
                onCheckedChange={() => handlePriorityChange("low")}
              >
                Low
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="col-span-12 md:col-span-3 md:text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shadow-sm border-gray-300">
                Status{" "}
                <span className="text-blue-500">
                  (
                  {taskStatus
                    .map((status) => statusNames[status])
                    .join(", ")
                    .toLocaleUpperCase()}
                  )
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={taskStatus.includes("todo")}
                onCheckedChange={() => handleTaskStatusChange("todo")}
              >
                To Do
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={taskStatus.includes("in_progress")}
                onCheckedChange={() => handleTaskStatusChange("in_progress")}
              >
                In Progress
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={taskStatus.includes("done")}
                onCheckedChange={() => handleTaskStatusChange("done")}
              >
                Done
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {myTasks &&
        myTasks.length > 0 &&
        myTasks.map((task) => (
          <Card className={"w-full mb-4 p-4 gap-2"} key={task.id}>
            <div className="flex justify-between items-center">
              <div className="md:flex gap-2">
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
                <h2 className="text-xl text-gray-800 font-medium mt-2 md:mt-0">
                  {task.title}
                </h2>
              </div>
              <div className="flex gap-2">
                <div className="hidden md:block">
                  <div
                    className="flex gap-1 bg-red-700 px-3 py-2 rounded text-white text-sm cursor-pointer"
                    onClick={() => taskDelete(task.id)}
                  >
                    <TrashIcon className="h-4 w-4" /> <span>Delete</span>
                  </div>
                </div>
                <Link
                  className={
                    "bg-gray-700 px-5 py-2 rounded text-white text-sm md:block hidden"
                  }
                  href={`/t/${task.id}/details`}
                >
                  <div className="flex items-center gap-1">
                    <EditIcon className="h-4 w-4" /> <span>Edit</span>
                  </div>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-12">
              <div className="col-span-8 md:col-span-2 flex gap-3 mt-2 items-center">
                {task.assigned_user && (
                  <>
                    <UserCircleIcon className="h-6 w-6 text-gray-500" />
                    <span>{task.assigned_user}</span>
                  </>
                )}
              </div>
              <div className="col-span-8 md:col-span-2 flex gap-2 mt-2">
                <div>
                  <Label>PRIORITY</Label>
                </div>
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
            <hr className="mt-3" />
            <div className="grid grid-cols-12">
              <div className="col-span-8 md:col-span-2 flex gap-1 mt-2 items-center">
                {task.due_date && (
                  <>
                    <CalendarSyncIcon className="mr-2 h-6 w-6" /> DUE
                    {" : "}
                    {formatDate(task.due_date)}
                  </>
                )}
              </div>
              <div className="col-span-8 md:col-span-2 flex gap-1 mt-2 items-center">
                {task.due_date && (
                  <>
                    <CalendarPlusIcon className="mr-2 h-6 w-6" /> ADDED ON
                    {" : "}
                    {formatDate(task.created_at)}
                  </>
                )}
              </div>
            </div>
            <div className="col-span-8 md:col-span-12 pb-4 mt-4 md:hidden sm:block flex gap-2 items-center justify-end md:hidden sm:inline">
              <div
                variant="outline"
                className="bg-red-700 py-2 px-3 text-white hover:bg-red-600 rounded text-sm"
                onClick={() => taskDelete(task.id)}
              >
                Delete
              </div>
              <Link
                className={"bg-gray-700 px-6 py-2 rounded text-white text-sm"}
                href={`/t/${task.id}/details`}
              >
                Edit
              </Link>
            </div>
          </Card>
        ))}
      {!myTasks ||
        (myTasks.length === 0 && (
          <div className="text-center">
            <Alert className={"max-w-md mx-auto mt-30 text-left shadow-lg"}>
              <AlertCircleIcon />
              <AlertTitle>No Tasks Found</AlertTitle>
              <AlertDescription>
                No tasks match your filter criteria. Please adjust your filters
                or{" "}
                <Link href="/create" className="text-blue-500">
                  Create a new task
                </Link>
                .
              </AlertDescription>
            </Alert>
          </div>
        ))}
    </div>
  );
}
