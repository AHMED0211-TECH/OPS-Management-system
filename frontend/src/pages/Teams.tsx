const teams = [
    {
        id: 1,
        name: "Security",
        members: 5,
        manager: "John Smith",
        status: "Active",
    },
    {
        id: 2,
        name: "Maintenance",
        members: 4,
        manager: "David Lee",
        status: "Active",
    },
    {
        id: 3,
        name: "Operations",
        members: 6,
        manager: "Sarah Johnson",
        status: "Active",
    },
];

export default function Teams() {
    return (
        <div>

            <div className="flex justify-between items-center mb-8">

                <div>
                    <h1 className="text-3xl font-bold">Teams</h1>

                    <p className="text-gray-500">
                        Manage operational teams.
                    </p>
                </div>

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
                    + Add Team
                </button>

            </div>

            <div className="bg-white rounded-xl shadow border overflow-hidden">

                <table className="w-full">

                    <thead className="bg-slate-100">

                        <tr>

                            <th className="text-left px-6 py-4">Team</th>

                            <th className="text-left px-6 py-4">Members</th>

                            <th className="text-left px-6 py-4">Manager</th>

                            <th className="text-left px-6 py-4">Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {teams.map(team => (

                            <tr
                                key={team.id}
                                className="border-t hover:bg-slate-50"
                            >

                                <td className="px-6 py-4 font-medium">
                                    {team.name}
                                </td>

                                <td className="px-6 py-4">
                                    {team.members}
                                </td>

                                <td className="px-6 py-4">
                                    {team.manager}
                                </td>

                                <td className="px-6 py-4">

                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                        {team.status}
                                    </span>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}