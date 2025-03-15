"use client";

export default function AboutPage() {

    async function queryAI(userInformation: string) {
        try {
            const res = await fetch("http://localhost:3000/GetSkills", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userProfile: `How can I get better at: ${userInformation}`,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to fetch skills");
            }

            const data = await res.json();
            return data;
            
        } catch (error) {
            console.error("Error fetching skills:", error);
        }
    }

    return (
        <div>
            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button
                className="text-white bg-blue-500 p-2 rounded"
                onClick={async ()=>{console.log(await queryAI("GET ME A GIRLFRIEND"))}}
            >
                Get Skills
            </button>
        </div>
    );
}
