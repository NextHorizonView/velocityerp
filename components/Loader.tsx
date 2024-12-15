import React from "react";

const FadeLoader: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <img
                src="/castEducation.jpg"
                alt="Loading..."
                className="w-24 h-24 animate-fade [animation-delay:500ms]"
      />
    </div>
  );
};

export default FadeLoader;
