"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  SelectContent,
  SelectItem,
  Select,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CreateTask() {
  const [date, setDate] = useState(new Date());
  return (
    <>
      <div className="flex min-h-screen">
        <form className="w-full rounded-lg max-w-3xl bg-white">
          <h1 className="text-2xl font-bold mt-10 mb-6">Create Task</h1>
          <div className="mb-4">
            <label
              htmlFor="taskTitle"
              className="block text-sm font-medium text-gray-700"
            >
              Title *
            </label>
            <Input
              id="taskTitle"
              type="text"
              className="mt-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="taskDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <Textarea
              id="taskDescription"
              rows="6"
              className="mt-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter task description"
            ></Textarea>
          </div>
          <div className="mb-4 flex gap-4 items-center">
            <Label className="text-sm font-medium text-gray-700 min-w-30">
              Due Date
            </Label>
            <DatePicker
              selected={date}
              minDate={new Date()}
              onChange={(date) => {
                console.log(date);
                setDate(date);
              }}
              dateFormat="dd-MMM-YYYY"
              placeholderText="Select due date"
              className="shadow-md p-2 block w-full rounded-md border-solid border-1 border-gray-300 max-w-50"
            />
          </div>
          <div className="mb-4 flex gap-4">
            <Label className="block text-sm font-medium text-gray-700 min-w-30">
              Priority
            </Label>
            <RadioGroup
              defaultValue="low"
              className="flex space-x-6"
              aria-label="Choose an option"
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="low" id="r1" />
                <Label htmlFor="r1">Low</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="medium" id="r2" />
                <Label htmlFor="r2">Medium</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="high" id="r3" />
                <Label htmlFor="r3">High</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="mb-4 flex gap-4 items-center">
            <Label
              className={"block text-sm font-medium text-gray-700  min-w-30"}
            >
              Status
            </Label>
            <Select value="todo">
              <SelectTrigger className="w-[180px]" defaultValue="todo">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4 flex gap-4 items-center">
            <Label className="block text-sm font-medium text-gray-700  min-w-30">
              Assign to
            </Label>
            <Select required>
              <SelectTrigger className="w-[180px]" defaultValue="unassigned">
                <SelectValue placeholder="Selct User" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="john">John Doe</SelectItem>
                  <SelectItem value="jane">Jane Smith</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="rounded-md bg-blue-600 px-10 mt-6 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Task
          </Button>
        </form>
      </div>
    </>
  );
}
