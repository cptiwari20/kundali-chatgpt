import LoadingDots from "@/components/ui/LoadingDots";
import { Props } from "@/utils/useUser";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { useState, FormEvent } from "react";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createServerSupabaseClient(ctx);
    const {
        data: { session }
    } = await supabase.auth.getSession();

    if (!session)
        return {
            redirect: {
                destination: '/signin',
                permanent: false
            }
        };

    return {
        props: {
        // initialSession: session,
             user: session.user
        }
    };
};

export default function Home(props: Props) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("")
    setResult("")
    if (!name || !time || !location || !date) {
        setError("Please fill all the inputs!")
        setLoading(false)
        return;
    }
    setLoading(true)
    // Call API to generate Kundali result with user input
    try {
        // Make API call to generate Kundali result
        const response = await fetch("/api/kundali", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, date, time, location }),
        });
  
        if (response.ok) {
          // Update state with generated Kundali result
          const { result } = await response.json();
          setResult(result?.content ?? "Failed to load content");
        } else {
            setError("Failed to generate Kundali result.")
          console.error("Failed to generate Kundali result.");
        }
        setLoading(false)
      } catch (error: any) {
        setError(error?.message)
        setLoading(false)
        console.error(error);
      }
    console.log(`Generating Kundali result for ${name} born on ${date} at ${time} in ${location}`);
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="bg-gray-400 p-4 rounded-xl">
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                </div>
                <div className="mb-4">
                <label htmlFor="date" className="block text-gray-700 font-bold mb-2">Date of Birth:</label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    // min={Date()}
                    onChange={(event) => setDate(event.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                </div>
                <div className="mb-4">
                <label htmlFor="time" className="block text-gray-700 font-bold mb-2">Time of Birth:</label>
                <input
                    type="time"
                    id="time"
                    value={time}
                    onChange={(event) => setTime(event.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                </div>
                <div className="mb-4">
                <label htmlFor="location" className="block text-gray-700 font-bold mb-2">Location of Birth:</label>
                <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                </div>
                {error && <p className="text-red-700 pb-2">{error}</p>}
                <button disabled={loading} type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                { loading? <LoadingDots /> : "Get Kundali Summary"}
                </button>
            </form>
        </div>
        <div className="bg-gray-500 p-5 rounded-xl">
            
            {results ? <div className="border border-gray-300 rounded-md shadow-lg p-6">
                    {results}
            </div>
            : 
            <h3>{loading ? <LoadingDots/> : "Results will appear here.."}</h3>
            }
        </div>
      </div>
    </div>
  );
}
