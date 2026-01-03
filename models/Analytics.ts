import mongoose, { Schema, model, models } from "mongoose";

const PortfolioViewSchema = new Schema(
    {
        userId: { 
            type: Schema.Types.ObjectId, 
            ref: "User", 
            required: true,
            index: true
        },
        visitorId: { 
            type: String, 
            required: true 
        }, // Cookie-based unique visitor ID
        timestamp: { 
            type: Date, 
            default: Date.now,
            index: true
        },
        referrer: { 
            type: String 
        }, // From where the visitor came
        userAgent: { 
            type: String 
        }, // Browser/device info
        country: { 
            type: String 
        }, // Geo-location
        device: { 
            type: String, 
            enum: ["desktop", "mobile", "tablet"],
            default: "desktop"
        },
        sessionDuration: { 
            type: Number 
        }, // In seconds
        pageViewed: { 
            type: String,
            default: "portfolio"
        }
    },
    { timestamps: true }
);

// Index for efficient queries
PortfolioViewSchema.index({ userId: 1, timestamp: -1 });
PortfolioViewSchema.index({ userId: 1, country: 1 });

export const PortfolioView = models.PortfolioView || model("PortfolioView", PortfolioViewSchema);

// Model for tracking leads/contact form submissions
const LeadSchema = new Schema(
    {
        portfolioUserId: { 
            type: Schema.Types.ObjectId, 
            ref: "User", 
            required: true,
            index: true
        },
        name: { 
            type: String, 
            required: true 
        },
        email: { 
            type: String, 
            required: true 
        },
        phone: { 
            type: String 
        },
        message: { 
            type: String, 
            required: true 
        },
        serviceInterest: { 
            type: String 
        }, // Which service they're interested in
        budget: { 
            type: String 
        }, // Rough budget
        timeline: { 
            type: String 
        }, // Project timeline
        status: { 
            type: String, 
            enum: ["new", "contacted", "qualified", "converted", "lost"],
            default: "new",
            index: true
        },
        notes: { 
            type: String 
        },
        readAt: { 
            type: Date 
        }
    },
    { timestamps: true }
);

LeadSchema.index({ portfolioUserId: 1, status: 1 });
LeadSchema.index({ portfolioUserId: 1, createdAt: -1 });

export const Lead = models.Lead || model("Lead", LeadSchema);
