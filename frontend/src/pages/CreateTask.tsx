export default function CreateTask() {
    return (
        <div className="max-w-3xl">

            <div className="mb-8">
                <h1 className="text-3xl font-bold">Create Task</h1>
                <p className="text-gray-500">
                    Create a new operational task.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-8">

                <form className="space-y-6">

                    <div>
                        <label className="block mb-2 font-medium">
                            Task Title
                        </label>

                        <input
                            type="text"
                            placeholder="Enter task title"
                            className="w-full border rounded-lg p-3"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Checklist
                        </label>

                        <select className="w-full border rounded-lg p-3">
                            <option>Daily Operations</option>
                            <option>Security Checklist</option>
                            <option>Maintenance Checklist</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Team
                        </label>

                        <select className="w-full border rounded-lg p-3">
                            <option>Security</option>
                            <option>Maintenance</option>
                            <option>Operations</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Frequency
                        </label>

                        <select className="w-full border rounded-lg p-3">
                            <option>Daily</option>
                            <option>Weekly</option>
                            <option>Monthly</option>
                            <option>Every X Hours</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Interval Hours
                        </label>

                        <input
                            type="number"
                            placeholder="Only for Every X Hours"
                            className="w-full border rounded-lg p-3"
                        />
                    </div>

                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                    >
                        Create Task
                    </button>

                </form>

            </div>

        </div>
    );
}