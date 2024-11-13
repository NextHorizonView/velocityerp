import React from 'react';

interface Event {
  title: string;
  date: string;
  views?: string;
  image?: string;
}

const UpcomingEvents = () => {
  const events: Event[] = [
    {
      title: "Horizon View Workshop for 8th, 9th & 10th",
      date: "11 Nov, 2024",
      views: "0.2K",
      image: "https://images.unsplash.com/photo-1725714834412-7d7154ac4e4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8"
    }
  ];

  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <h2 className="text-[#576086] font-semibold mb-4">Upcoming Events</h2>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={index} className="flex items-center justify-between bg-white rounded-lg p-4">
            <div className="flex gap-4">
              <img src={event.image} alt={event.title} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <h3 className="text-[#576086] font-medium">{event.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{event.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">{event.views}</span>
              </div>
              <button className="text-[#576086] hover:text-[#F7B696]">...</button>
            </div>
          </div>
        ))}
        <button className="bg-black text-white px-4 py-2 rounded-lg text-sm">View Now</button>
      </div>
    </div>
  );
};

export default UpcomingEvents;