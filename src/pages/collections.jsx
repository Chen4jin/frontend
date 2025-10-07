import Navbar from "../components/navbar";
import Stats from "../components/stats";
import { useState, useEffect } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-responsive-masonry";
import { ResponsiveMasonry } from "react-responsive-masonry";
import { fetchImages } from "../redux/imageListSlice";
import { useSelector, useDispatch } from "react-redux";
import { loadImage } from "../redux/setup";

const Collections = () => {
    const dispatch = useDispatch();
    const { images, hasMore, page, lastKey } = useSelector((state) => state.imageList);
    const { imagesLoad } = useSelector((state) => state.setup);
    const loadMoreImages = () => {

        dispatch(fetchImages({ lastKey: lastKey, page: page }));
    };

    useEffect(() => {
        if (!imagesLoad) {
            dispatch(fetchImages({ lastKey: "", page: page }));
            dispatch(loadImage())
        }
    }, []);

    return (
        <div>
            <Navbar />
            <div className="w-4xl justify-self-center 2xl:w-[40%]">
                <div className="max-w-2xl py-32 sm:py-48 lg:py-32">
                    <div className="text-left">
                        <h1 className="text-5xl font-BlinkMacSystemFont tracking-tight text-balance text-gray-900 sm:text-7xl">
                            Collections
                        </h1>
                        <p className="mt-8 text-lg font-BlinkMacSystemFont text-pretty text-gray-500 sm:text-xl/8">
                            Through my lens:<br/>a journey of moments, memories, and inspiration.
                        </p>
                    </div>
                </div>
                <div className="w-[120%] -translate-x-[10%] pb-16">
                    <InfiniteScroll dataLength={images.length} next={loadMoreImages} hasMore={hasMore} loader={<></>}>
                        <ResponsiveMasonry columnsCountBreakPoints={{ 700: 4 }}>
                            <Masonry gutter="20px">
                                {images.map((image) => {
                                    return (
                                        <img
                                            className="h-auto max-w-full rounded-lg"
                                            key={image.imageID}
                                            src={image.cloudFront}
                                        />
                                    );
                                })}
                            </Masonry>
                        </ResponsiveMasonry>
                    </InfiniteScroll>
                </div>
            </div>
        </div>
    );
};

export default Collections;
