import React from 'react';
import defaultPost from "../assets/defaultPost.png";
import globe from "../assets/globe.png";
import hammer from "../assets/hammer.png";
import brain from "../assets/brain.png";
import building from "../assets/building.png";
import graph from "../assets/graph.png";
import paint from "../assets/paint.png";
import atom from "../assets/atom.png";
import computer from "../assets/computer.png";
import leaf from "../assets/leaf.png";
import chemistry from "../assets/chemistry.png";
import drama from "../assets/drama.png";

const selectPostImage = (type) => {
    switch(type){
        case 1:
            return globe;
        case 2:
            return hammer;
        case 3:
            return brain;
        case 4:
            return building;
        case 5:
            return graph;
        case 6:
            return paint;
        case 7: 
            return atom;
        case 8:
            return computer;
        case 9:
            return leaf;
        case 10:
            return chemistry;
        case 11:
            return drama;
        default:
            return defaultPost;
    }
}

const DepartmentImage = ({ type }) => (
    <img src={selectPostImage(type)} alt="" className="post-icon" />
);

export default DepartmentImage;