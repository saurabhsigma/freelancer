import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        username: { type: String, unique: true, sparse: true },
        bio: { type: String },
        headline: { type: String },
        location: { type: String },
        resumeUrl: { type: String },
        image: { type: String },
        skills: [{ type: String }],
        socials: {
            twitter: { type: String },
            linkedin: { type: String },
            github: { type: String },
            website: { type: String },
        },
        experience: [
            {
                title: { type: String },
                company: { type: String },

                current: { type: Boolean, default: false },
                description: { type: String }
            }
        ],
        education: [
            {
                school: { type: String },
                degree: { type: String },
                field: { type: String },
                graduationYear: { type: Number },
                description: { type: String }
            }
        ],
        certifications: [
            {
                name: { type: String },
                issuer: { type: String },
                issueDate: { type: Date },
                expiryDate: { type: Date },
                credentialUrl: { type: String }
            }
        ],
        services: [
            {
                name: { type: String },
                description: { type: String },
                price: { type: Number } // price per service or monthly
            }
        ],
        hourlyRate: { type: Number }, // hourly rate in USD
        availability: {
            status: { type: String, enum: ['available', 'busy', 'unavailable'], default: 'available' },
            hoursPerWeek: { type: Number }, // how many hours available per week
            timezone: { type: String } // e.g., "UTC", "EST", "PST"
        },
        profileConfig: {
            theme: { type: String, default: "minimal" }, // minimal, bold, professional, grid
            colorMode: { type: String, default: "system" },
            primaryColor: { type: String, default: "blue" },
            font: { type: String, default: "inter" }, // inter, playfair, roboto_mono
            animationIntensity: { type: String, default: "medium" }, // low, medium, high
            customColors: {
                background: { type: String },
                text: { type: String },
                accent: { type: String }
            },
            sections: [
                {
                    id: { type: String },
                    type: { type: String }, // hero, skills, projects, contact
                    visible: { type: Boolean, default: true },
                    order: { type: Number }
                }
            ],
            // Visibility toggles for professional sections
            showExperience: { type: Boolean, default: true },
            showEducation: { type: Boolean, default: true },
            showCertifications: { type: Boolean, default: true },
            showServices: { type: Boolean, default: false },
            showHourlyRate: { type: Boolean, default: false },
            customDomain: { type: String, sparse: true }
        }
    },
    { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
