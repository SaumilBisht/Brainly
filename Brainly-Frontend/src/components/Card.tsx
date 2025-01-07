import { Share } from "../icons/Share";
import { useEffect } from "react";
interface CardProps{
  title:string;
  link:string;
  type:"twitter"|"youtube";
}
export function Card({title,link,type}:CardProps)
{
  useEffect(() => {
    if (type === "twitter" && (window as any).twttr) {
      (window as any).twttr.widgets.load();
    }
  }, [type, link]);
  return (
  <div className="bg-white text-black shadow-sm max-w-96 h-full rounded-md border p-4">
    <div className="flex justify-between">
      <div className="flex justify-center items-center ">
        <div className="pr-2 text-gray-500">
          <Share size="md"></Share>
        </div>
        Project Ideas
      </div>
      <div className="flex justify-center items-center">
        <div className="pr-2 text-gray-500">
          <Share size="md"></Share>
        </div>
        <div className="pr-2 text-gray-500">
          <Share size="md"></Share>
        </div>
      </div>
    </div>

    <div className="font-bold text-lg flex justify-center pt-4">{title}</div>

    <div className="pt-4">
          {type==="youtube" && (<iframe
                            className="w-full"
                            src={link
                                .replace("watch", "embed")
                                .replace("?v=", "/")}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>) }
          
          {type === "twitter" && (
                        <blockquote className="twitter-tweet">
                            <a href={link.replace("x.com", "twitter.com")}></a>
                        </blockquote>
                    )}
          
    </div>
  </div>
  )
}