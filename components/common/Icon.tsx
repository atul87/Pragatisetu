
import React from 'react';
import { IssueCategory } from '../../types';

const CATEGORY_ICONS: Record<IssueCategory, string> = {
    "Roads & Potholes": "fa-road",
    "Water Supply & Leakage": "fa-tint",
    "Garbage & Waste Disposal": "fa-trash",
    "Street Lights": "fa-lightbulb",
    "Public Parks & Recreation": "fa-tree",
    "Sewage & Drainage": "fa-water",
    "Illegal Construction": "fa-hard-hat",
    "Public Transport": "fa-bus",
    "Other": "fa-question-circle"
};

interface CategoryIconProps {
    category: IssueCategory;
    className?: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className }) => {
    return <i className={`fas ${CATEGORY_ICONS[category]} ${className}`}></i>;
};

export default CategoryIcon;
