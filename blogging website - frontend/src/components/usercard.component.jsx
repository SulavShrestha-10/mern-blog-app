import React from "react";
import AnimationWrapper from "../common/page-animation";
import { Link } from "react-router-dom";

const UserCard = ({ index, user }) => {
	const {
		personal_info: { fullName, username, profile_img },
	} = user;
	return (
		<AnimationWrapper transition={{ duration: 1, delay: index * 0.08 }}>
			<Link to={`/user/${username}`} className="flex gap-5 items-center mb-5 ">
				<img src={profile_img} className="w-14 h-14 rounded-full " />
				<div>
					<h1 className="font-medium text-xl line clamp-2">{fullName}</h1>
					<p className="text-dark-grey"> @{username}</p>
				</div>
			</Link>
		</AnimationWrapper>
	);
};

export default UserCard;
