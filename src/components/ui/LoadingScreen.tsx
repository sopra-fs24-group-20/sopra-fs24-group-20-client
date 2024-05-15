import React from "react";
import "../../styles/ui/LoadingScreen.scss";

const CategoriesLoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-text">
        <h1 className="categories-text">Categories</h1>
        <div className="loading-ball-first"></div>
        <div className="loading-ball-second"></div>
        <div className="loading-ball-third"></div>
        <div className="loading-ball-fourth"></div>
      </div>
    </div>
  );
};

export default CategoriesLoadingScreen;