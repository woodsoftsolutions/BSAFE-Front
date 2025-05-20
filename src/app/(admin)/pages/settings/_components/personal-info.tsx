'use client';

import { useEffect, useState } from "react";
import {
  CallIcon,
  EmailIcon,
  PencilSquareIcon,
  UserIcon,
} from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { getAuthUser } from "@/lib/services/auth";

export function PersonalInfoForm() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    username: "",
  });

  useEffect(() => {
    const authUser = getAuthUser();
    if (authUser) {
      setUser(authUser);
      setForm({
        fullName: authUser.name || "",
        phoneNumber: "", // No phone in AuthUser, leave blank
        email: authUser.email || "",
        username: authUser.email ? authUser.email.split("@")[0] : "",
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <ShowcaseSection title="Personal Information" className="!p-7">
      <form>
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="fullName"
            label="Full Name"
            placeholder="David Jhon"
            value={form.fullName}
            handleChange={handleChange}
            icon={<UserIcon />}
            iconPosition="left"
            height="sm"
          />

          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="phoneNumber"
            label="Phone Number"
            placeholder="+990 3343 7865"
            value={form.phoneNumber}
            handleChange={handleChange}
            icon={<CallIcon />}
            iconPosition="left"
            height="sm"
          />
        </div>

        <InputGroup
          className="mb-5.5"
          type="email"
          name="email"
          label="Email Address"
          placeholder="devidjond45@gmail.com"
          value={form.email}
          handleChange={handleChange}
          icon={<EmailIcon />}
          iconPosition="left"
          height="sm"
        />

        <InputGroup
          className="mb-5.5"
          type="text"
          name="username"
          label="Username"
          placeholder="devidjhon24"
          value={form.username}
          handleChange={handleChange}
          icon={<UserIcon />}
          iconPosition="left"
          height="sm"
        />

        <div className="flex justify-end gap-3">
          <button
            className="rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
            type="button"
          >
            Cancel
          </button>

          <button
            className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </ShowcaseSection>
  );
}
