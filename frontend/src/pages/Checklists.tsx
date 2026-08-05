export default function Checklists() {
    return (
        <div>

            <div className="flex justify-between items-center mb-6">

                <div>
                    <h1 className="text-3xl font-bold">
                        Master Checklists
                    </h1>

                    <p className="text-gray-500">
                        Manage operational checklists.
                    </p>
                </div>

                <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
                    + New Checklist
                </button>

            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

                <table className="w-full">

                    <thead className="bg-slate-50">

                        <tr>

                            <th className="px-6 py-4 text-left">
                                Title
                            </th>

                            <th className="px-6 py-4 text-left">
                                Created By
                            </th>

                            <th className="px-6 py-4 text-left">
                                Created On
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr className="border-t">

                            <td className="px-6 py-4">
                                Daily Operations
                            </td>

                            <td className="px-6 py-4">
                                Manager
                            </td>

                            <td className="px-6 py-4">
                                05 Aug 2026
                            </td>

                        </tr>

                        <tr className="border-t">

                            <td className="px-6 py-4">
                                Security Checklist
                            </td>

                            <td className="px-6 py-4">
                                Manager
                            </td>

                            <td className="px-6 py-4">
                                05 Aug 2026
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>
    );
}