"use client";

export default function AboutPage() {

    async function getSkillsAPICall() {
        try {
            const res = await fetch("http://localhost:3000/GetSkills", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mode: "new",
                    userProfile: "How can I get better at leetcode",
                    oldTasks: [
                        "Write down three things you're grateful for today 🌟",
                        "Stretch for 5 minutes to release tension 💪",
                        "Listen to your favorite song and dance for a mood boost 💃",
                    ],
                    oldUserProfile:
                        "I've been feeling depressed, not sleeping well, wish I had a gf and more friends, how can I improve my life?",
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to fetch skills");
            }

            const data = await res.json();
            const tasks = data["tasks"]
            console.log("Data from API:", typeof (tasks));
            console.log("Data from API:", tasks);
            
        } catch (error) {
            console.error("Error fetching skills:", error);
        }
    }

    return (
        <div>
            <button
                className="text-white bg-blue-500 p-2 rounded"
                onClick={getSkillsAPICall}
            >
                Get Skills
            </button>
        </div>
    );
}
