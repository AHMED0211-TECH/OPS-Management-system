type Props = {
    title: string;
    value: number;
};

export default function StatCard({
    title,
    value,
}: Props) {
    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg hover:-translate-y-1 transition duration-200">

            <p className="text-gray-500">
                {title}
            </p>

            <h2 className="text-4xl font-bold mt-3">
                {value}
            </h2>

        </div>
    );
}