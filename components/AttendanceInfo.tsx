// components/AttendanceInfo.tsx
const AttendanceInfo = () => (
    <div className="bg-gray-100 rounded-lg p-6 mr-6">
      <h2 className="text-[#576086] font-semibold mb-4">Today's Attendance</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-[#576086]">BOYS:</span>
          <span className="text-[#576086]">550 / 600</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#576086]">GIRLS:</span>
          <span className="text-[#576086]">850 / 1260</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#576086]">Total:</span>
          <span className="text-[#576086]">1400 / 1860</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#576086]">ABSENT:</span>
          <span className="text-[#576086]">460</span>
        </div>
      </div>
    </div>
  );
  
  export default AttendanceInfo;
  