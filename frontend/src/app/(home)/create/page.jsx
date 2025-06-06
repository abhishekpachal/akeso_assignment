"use client";
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
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CreateTask() {
  const [date, setDate] = useState(new Date());
  return (
    <>
      <div className="flex min-h-screen">
        <form className="w-full rounded-lg ">
          <h1 className="text-2xl font-bold mt-10 mb-2">CREATE TASK</h1>
          <hr className="mb-6" />
          <div className="max-w-3xl">
            <div className="mb-4">
              <Label htmlFor="taskTitle" className="block text-md">
                Title *
              </Label>
              <Input
                id="taskTitle"
                type="text"
                maxLength="100"
                className="mt-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter task title"
                required
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
                rows="4"
                maxLength="500"
                className="mt-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter task description"
              ></Textarea>
            </div>
            <div className="mb-4 flex gap-4 items-center">
              <Label className=" text-md text-gray-700 min-w-30">
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
              <Label className="block text-sm  text-md text-gray-700 min-w-30">
                Priority
              </Label>
              <RadioGroup
                defaultValue="low"
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
              <Label className="block text-sm text-md text-gray-700  min-w-30">
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
              className="rounded-md bg-blue-600 px-10 mt-6 py-2 text-white md:w-auto w-full "
            >
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
