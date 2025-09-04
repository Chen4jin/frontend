import Sidebar from "../components/sidebar";

const Dashboard = ({ children }) => {
    return (
        <>
            <Sidebar></Sidebar>
            <div className="p-4 sm:ml-64">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                    {children}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
