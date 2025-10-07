"use client";

import Navbar from "../components/navbar";
import Stats from "../components/stats";

const Home = () => {
    return (
        <div>
            <Navbar />
            <section className="flex flex-row relative isolate overflow-hidden bg-white py-8 justify-self-center xl:py-48  px-8">
                <div className="py-64 pr-8 pl-20">
                    <img
                        className="rounded-full w-64 h-64"
                        src="https://d3bjrjf10s3vbi.cloudfront.net/static/selfie.png"
                    />
                </div>
                <div>
                    <div className="max-w-3xl py-56">
                        <div className="text-left">
                            <h1 className="text-7xl font-semibold tracking-tight text-balance text-gray-900">
                                Software Engineer,
                                <br />
                                Amateur Photographer
                            </h1>
                            <p className="mt-12 text-xl/8 font-medium text-pretty text-gray-500">
                                Experienced software developer specializing in Python, Java, System design, and
                                AWS-based solutions. Proven track record in leading teams, managing end-to-end projects,
                                and delivering scalable applications. Strong communicator and problem-solver, driven by
                                continuous learning and innovation.
                            </p>
                            <div className="mt-10 flex gap-x-6">
                                <a href="https://d3bjrjf10s3vbi.cloudfront.net/static/CV.pdf" className="text-sm/6 font-semibold text-gray-900" download >
                                    Download CV <span aria-hidden="true">→</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-indigo-600/10 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
            </section>
        </div>
    );
};

export default Home;
