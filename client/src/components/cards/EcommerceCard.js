import React from "react";
import { Box, Icon, Text, Heading } from "../elements";

export default function EcommerceCard({ variant, trend, number, title, icon, percent, compare, dotsMenu }) {
  return (
    <Box className={`mc-ecommerce-card ${variant}`}>
      <Icon className="mc-ecommerce-card-trend material-icons">{trend}</Icon>
      <Box className="mc-ecommerce-card-head">
        <Heading as="h4" className="mc-ecommerce-card-meta">
          <Text as="span" title={title}> {/* Add the title attribute here */}
            {title}
          </Text>
          {number}
        </Heading>
        <Icon className="mc-ecommerce-card-icon material-icons">{icon}</Icon>
      </Box>
    </Box>
  );
}
