const ErrorPage = ({ error }: { error: Error }): React.JSX.Element => {
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Something is wrong...</h1>
      <p>{error.message}</p>
    </div>
  );
};

export default ErrorPage;
