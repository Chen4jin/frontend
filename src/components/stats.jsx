import { useState, useEffect } from "react";
import { getVisitor } from "../utils/GetVisitor";
import { getPhoto } from "../utils/GetPhoto";
import { getCV } from "../utils/GetCV";
import { useSelector, useDispatch } from "react-redux";

const Stats = () => {
    const [items, setItems] = useState([]);
    const dispatch = useDispatch();
    const { monthlyVisitor, photoCollections, cvDownload } = useSelector((state) => state.stats);

    const loadData = async () => {
        try {
            if (monthlyVisitor === 0 && photoCollections === 0 && cvDownload === 0) {
                await dispatch(getVisitor()).unwrap();
                await dispatch(getPhoto()).unwrap();
                await dispatch(getCV()).unwrap();
            }
            getStats();
        } catch (error) {
            console.error("One of the requests failed", error);
        }
    };

    const getStats = async () => {
        try {
            const data = [
                { id: 1, name: "Monthly Visitor", value: monthlyVisitor },
                { id: 2, name: "Photo collections", value: photoCollections },
                { id: 3, name: "CV Download", value: cvDownload },
            ];
            setItems(data);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, [monthlyVisitor, photoCollections, cvDownload]);

    return (
        <div className="mx-auto max-w-7xl px-8 py-12 xl:py-48 bg-white">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center sm:grid-cols-3">
                {items.map((data) => (
                    <div key={data.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
                        <dt className="text-base/7 text-gray-600">{data.name}</dt>
                        <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                            {data.value}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
};

export default Stats;
