import React from "react";

const WelcomeText = () => {
  return (
    <div className="border border-gray-400 rounded-md p-2 hidden">
      <p>
        Hello <span className="font-bold text-xl">Nelson</span>, welcome to the
        grades scraper.
      </p>
      <p className="mt-2">
        Please enter student credentials to get started. If you have any issues,
        please contact me.{" "}
      </p>
    </div>
  );
};

export default WelcomeText;
