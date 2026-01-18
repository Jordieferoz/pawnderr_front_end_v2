"use client";

import { X } from "lucide-react";
import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


import { closeNotificationModal } from "@/store/modalSlice";
import { images } from "@/utils/images";
import { RootState } from "@/store";

const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        type: "match",
        title: "Matches: Congratulations! You have a New Match",
        time: "Today",
        read: false,
        image: images.doggo1.src,
    },
    {
        id: 2,
        type: "promo",
        title: "Pawnderr+: Congratulations! You have a New offer. Get 30% off on Pawnderr+.",
        time: "Today",
        read: false,
        image: images.doggo2.src, // Assuming another image exists, fallback if not
    },
    {
        id: 3,
        type: "match",
        title: "Matches: Congratulations! You have a New Match",
        time: "2 days ago",
        read: true,
        image: images.doggo1.src,
    },
];

export const Notifications: FC = () => {
    const dispatch = useDispatch();
    const isNotificationModalOpen = useSelector((state: RootState) => state.modal.isNotificationModalOpen);
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

    if (!isNotificationModalOpen) return null;

    const handleMarkAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-[60] md:bg-transparent"
                onClick={() => dispatch(closeNotificationModal())}
            />

            {/* Modal/Dropdown */}
            <div className="fixed inset-x-0 bottom-0 md:inset-auto md:top-20 md:right-4 md:w-[400px] bg-white rounded-t-[32px] md:rounded-[24px] shadow-xl z-[70] overflow-hidden flex flex-col max-h-[80vh] md:max-h-[600px] border border-gray-100">

                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-2">
                    <h3 className="heading2_medium text-accent-900">Notifications</h3>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleMarkAllAsRead}
                            className="text-blue-500 text-sm font-medium hover:text-blue-600"
                        >
                            Mark as Read
                        </button>
                        <button
                            onClick={() => dispatch(closeNotificationModal())}
                            className="p-1 hover:bg-gray-100 rounded-full"
                        >
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="overflow-y-auto p-4 flex flex-col gap-4">
                    {notifications.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No notifications
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div key={notification.id} className={`flex gap-3 p-3 rounded-xl transition-colors ${notification.read ? 'bg-white' : 'bg-blue-50/50'}`}>
                                <img
                                    src={notification.image}
                                    alt="avatar"
                                    className="w-12 h-12 rounded-full object-cover border border-gray-100 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-800 font-medium leading-snug mb-1">
                                        {notification.title}
                                    </p>
                                </div>
                                <div className="shrink-0">
                                    <p className="text-xs text-gray-400">
                                        {notification.time}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};
