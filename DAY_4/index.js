const skills =[
    {skillName: "HTML" , proficiency: "Advanced" , experience: "5 Years"},
    {skillName: "CSS " , proficiency: "Advanced" , experience: "3 Years"},
    {skillName: "JAVA" , proficiency: "Intermediate" , experience: "1 Years"},
    {skillName: "PYTHON" , proficiency:"Advanced" , experience: "4 Years"}
];

const sorted = (skills) => skills.sort((a,b) => {
    if (a.skillName < b.skillName) return -1;
    if (a.skillName > b.skillName) return 1;
    return 0;
})

function showSkills(skillsArray){
    return skillsArray.map(skills => {
        return `${skills.skillName} (${skills.proficiency}) - ${skills.experience}`;
    })
};

const result = showSkills(sorted(skills));
console.log(result)

