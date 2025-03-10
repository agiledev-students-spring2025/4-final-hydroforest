import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Paper, Button, Select, MenuItem, Typography, Box, Modal, Grid } from "@mui/material";
import { motion } from "framer-motion";

// Define multiple trees with their stage images
const trees = {
  tree1: {
    seed: "https://picsum.photos/200?random=1",
    sprout: "https://picsum.photos/200?random=2",
    seedling: "https://picsum.photos/200?random=3",
    sapling: "https://picsum.photos/200?random=4",
    "adult tree": "https://picsum.photos/200?random=5",
  },
  tree2: {
    seed: "https://picsum.photos/200?random=6",
    sprout: "https://picsum.photos/200?random=7",
    seedling: "https://picsum.photos/200?random=8",
    sapling: "https://picsum.photos/200?random=9",
    "adult tree": "https://picsum.photos/200?random=10",
  },
  tree3: {
    seed: "https://picsum.photos/200?random=11",
    sprout: "https://picsum.photos/200?random=12",
    seedling: "https://picsum.photos/200?random=13",
    sapling: "https://picsum.photos/200?random=14",
    "adult tree": "https://picsum.photos/200?random=15",
  },
};

const treeOptions = Object.keys(trees); // ["tree1", "tree2", "tree3"]

const HomePage = () => {
  const [totalIntake, setTotalIntake] = useState(0);
  const [unit, setUnit] = useState("cups");
  const [treeStage, setTreeStage] = useState("seed");
  const [inputAmount, setInputAmount] = useState(0);
  const [isWatering, setIsWatering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTree, setSelectedTree] = useState("tree1"); // Track the selected tree

  const handleLogWater = () => {
    const amount = Number(inputAmount);
    if (amount > 0) {
      setIsWatering(true);
      setTimeout(() => setIsWatering(false), 1000);

      const newTotalIntake = totalIntake + amount;
      setTotalIntake(newTotalIntake);

      // Update tree stage based on total intake
      if (newTotalIntake >= 2 && newTotalIntake < 4) setTreeStage("sprout");
      else if (newTotalIntake >= 4 && newTotalIntake < 6) setTreeStage("seedling");
      else if (newTotalIntake >= 6 && newTotalIntake < 8) setTreeStage("sapling");
      else if (newTotalIntake >= 8) setTreeStage("adult tree");
    }
  };

  const handleTreeChange = (treeKey) => {
    setSelectedTree(treeKey); // Update the selected tree
    setIsModalOpen(false); // Close the modal
  };

  return (
    <Box
      sx={{
        backgroundColor: "#5DA271",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        color: "white",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "10px 20px", position: "absolute", top: 0 }}>
        <Typography variant="h6">Hi, Jaleen1!</Typography>
        <MenuIcon sx={{ color: "white" }} />
      </Box>

      {/* Tree Section */}
      <Typography variant="subtitle1" sx={{ color: "white", marginBottom: "10px" }}>
        Today you drank {totalIntake} cups
      </Typography>
      <Typography variant="h6" sx={{ marginBottom: "10px", color: "white" }}>
        {treeStage}
      </Typography>
      <motion.div
        animate={{ scale: isWatering ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 1 }}
      >
        <Box
          sx={{
            width: "200px",
            height: "200px",
            backgroundColor: "#F0F8EA",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "10px auto",
          }}
        >
          <img
            src={trees[selectedTree][treeStage]} // Use the selected tree's stage image
            alt="Tree Icon"
            style={{ width: "190px", height: "190px", borderRadius:"50%" }}
          />
        </Box>
      </motion.div>
      <Button
        variant="contained"
        sx={{ marginTop: "10px", backgroundColor: "#FFF59D", color: "black" }}
        onClick={() => setIsModalOpen(true)}
      >
        Change Tree
      </Button>

      {/* Water Intake Card */}
      <Paper
        elevation={3}
        sx={{
          padding: "20px",
          textAlign: "center",
          width: "90%",
          maxWidth: "350px",
          borderRadius: "15px",
          backgroundColor: "#E6F2E6",
          marginTop: "20px",
        }}
      >
        <Box sx={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
          <input
            type="number"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            style={{
              padding: "8px",
              width: "100px",
              height: "50px",
              textAlign: "center",
              borderRadius: "10px",
              border: "1px solid #ccc",
            }}
          />
          <Select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            sx={{
              padding: "5px",
              borderRadius: "10px",
              backgroundColor: "white",
              height: "50px",
            }}
          >
            <MenuItem value="cups">Cups</MenuItem>
            <MenuItem value="oz">Ounces</MenuItem>
            <MenuItem value="ml">Milliliters</MenuItem>
          </Select>
        </Box>

        <Button
          onClick={handleLogWater}
          variant="contained"
          color="primary"
          sx={{
            width: "80%",
            borderRadius: "20px",
            fontSize: "16px",
          }}
        >
          Log Water Intake
        </Button>
      </Paper>

      {/* Modal for Changing Tree */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          sx={{
            padding: "20px",
            width: "90%",
            maxWidth: "400px",
            borderRadius: "15px",
            backgroundColor: "#E6F2E6",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "20px" }}>
            Select a Tree
          </Typography>
          <Grid container spacing={2}>
            {treeOptions.map((treeKey) => (
              <Grid item xs={4} key={treeKey}>
                <img
                  src={trees[treeKey]["adult tree"]} // Show the current stage of each tree
                  alt={`Tree ${treeKey}`}
                  style={{ width: "100px", height: "100px", cursor: "pointer", borderRadius: "50%" }}
                  onClick={() => handleTreeChange(treeKey)}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Modal>
    </Box>
  );
};

export default HomePage;
