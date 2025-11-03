import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center bg-gradient-to-br from-secondary to-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-2xl"
      >
        <div className="space-y-2">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-9xl font-display font-bold text-accent"
          >
            404
          </motion.div>
          <h1 className="text-4xl font-display font-bold text-primary">
            Page Not Found
          </h1>
          <p className="text-lg text-primary/70 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => navigate("/")}
            className="gap-2 min-w-[180px]"
          >
            <ApperIcon name="Home" size={18} />
            Back to Home
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2 min-w-[180px]"
          >
            <ApperIcon name="ArrowLeft" size={18} />
            Go Back
          </Button>
        </div>

        <div className="pt-8 border-t border-primary/10 mt-8">
          <p className="text-sm text-primary/60 mb-4">
            Looking for something specific? Try these popular pages:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate("/category/women")}
              className="px-4 py-2 text-sm text-primary hover:text-accent border border-primary/20 rounded-lg hover:border-accent transition-colors"
            >
              Women's Fashion
            </button>
            <button
              onClick={() => navigate("/category/men")}
              className="px-4 py-2 text-sm text-primary hover:text-accent border border-primary/20 rounded-lg hover:border-accent transition-colors"
            >
              Men's Fashion
            </button>
            <button
              onClick={() => navigate("/category/accessories")}
              className="px-4 py-2 text-sm text-primary hover:text-accent border border-primary/20 rounded-lg hover:border-accent transition-colors"
            >
              Accessories
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="px-4 py-2 text-sm text-primary hover:text-accent border border-primary/20 rounded-lg hover:border-accent transition-colors"
            >
              Shopping Cart
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;