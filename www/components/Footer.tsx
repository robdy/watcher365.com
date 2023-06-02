const Footer = () => {
  return (
    <div className="py-4 px-2 border-t  bg-white text-sm md:text-base  ">
      <div className=" container max-w-5xl mx-auto ">
        <p className="text-center">
          &copy; {process.env.PROJECT_NAME} | All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
