"use server";

import { User } from "@/models/User";
import connectToDatabase from "@/lib/db";
import bcrypt from "bcryptjs";
import { login, logout } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function handleLogin(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Please provide both email and password." };
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
        return { error: "Invalid credentials." };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
        return { error: "Invalid credentials." };
    }

    await login({ id: user._id.toString(), email: user.email, name: user.name });
    redirect("/");
}

export async function handleSignup(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
        return { error: "All fields are required." };
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return { error: "User already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        passwordHash: hashedPassword,
    });

    await login({ id: user._id.toString(), email: user.email, name: user.name });
    redirect("/");
}

export async function handleLogout() {
    await logout();
    redirect("/login");
}
