import React from 'react';
// import {Link} from 'react-router-dom'
// import {FaArrowRight} from 'react-icons/fa'
import "../App.css";
//import HeroSection from "../components/core/HomePage/HeroSection"
import {Button} from "../components/ui/Button";
import { InteractiveGrid } from "../components/ui/InteractiveGrid"
import { ShineBorder } from "../components/ui/ShineBorder"
import { Play } from "lucide-react"
import {Link} from 'react-router-dom'
import CodeBlocks from "../components/core/HomePage/CodeBlocks"
import HighlightText from "../components/core/HomePage/HighlightText"
import image1 from "../assets/Images/codingimage1.jpg"


import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection"

const Home = () => {
  return (

    
    <div >
 
 {/* <h>Hello</h> */}
      
  {/* <HeroSection/> */}
 <section className="relative min-h-screen pt-32 pb-16 overflow-hidden bg-black">
      <InteractiveGrid containerClassName="absolute inset-0 pointer-events-auto" className="opacity-30" points={40} />

      <ShineBorder
        className="relative z-10 max-w-6xl mx-auto px-6"
        borderClassName="border border-white/10 rounded-xl overflow-hidden"
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
           Empower Your Future With  <HighlightText text={"Coding Skills "} />
          
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
        With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
          </p>
          <div className="flex gap-4 justify-center">
             <Link to="/demo">
              <Button variant="outline" className="gap-2 border-white/10 bg-white/5 hover:bg-white/10">
                <Play className="w-4 h-4" />
                Demo
              </Button>
            </Link>
          
               <Link to= {"/signup"}>
                 <Button variant="secondary" className="bg-white text-black hover:bg-gray-100">
             Learn More
            </Button>
            </Link>
          
          </div>
        </div>

        <ShineBorder className="relative mx-auto" borderClassName="border border-white/10 rounded-xl overflow-hidden">
          <div className="relative">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Hero%20image.jpg-mE5vAT4d864MlVhdkcrk1Vn2WcNONq.jpeg"
              alt="Background Gradient"
              className="w-full h-auto"
            />
            <div className="absolute inset-0 flex items-end justify-center pb-16">
              <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl w-[90%] h-[70%] flex">
                <div className="flex-1 pr-2">
                  <img
                    src={image1}
                    alt="Browser Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 pl-2">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Editor%20Window-sJ4sXlXpgDhv7gLvQylqH5VTb3L0rc.png"
                    alt="Code Editor"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </ShineBorder>
      </ShineBorder>
    </section>
  <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-semibold">
                Unlock your
                <HighlightText text={"coding potential"} /> with our online
                courses.
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabtn1={{
              btnText: "Try it Yourself",
              link: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              link: "/signup",
              active: false,
            }}
            codeColor={"text-yellow-25"}
            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">\nTwo</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
          />
        </div>
       
        <div>
          <LearningLanguageSection/>
        </div>
 

    </div>
  );
};

export default Home;
