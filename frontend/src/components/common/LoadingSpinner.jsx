import CircularProgress from "@mui/material/CircularProgress";

// const Loading = ({ fullScreen = true }) => {
const LoadingSpinner = () => {
  return (
    // <div
    //   className={`flex items-center justify-center ${fullScreen ? "h-screen" : "min-h-[200px]"}`}
    // >
    //   <div className="flex flex-col items-center gap-3">
    //     <div
    //       className="w-10 h-10 border-[3px] border-gray-200 border-t-blue-500 rounded-full animate-spin"
    //       role="status"
    //       aria-label="Loading"
    //     />
    //   </div>
    // </div>
    <CircularProgress size={40} aria-label="Loading…" />
  );
};

export default LoadingSpinner;
