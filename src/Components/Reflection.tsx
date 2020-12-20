// React Imports
import React, { FC } from "react";
import Heading from "./Heading";
import TextArea from "./TextArea";

// Material UI Imports
import { makeStyles } from "@material-ui/core/styles";
import {} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({}));

interface ReflectionProps {}

const Reflection: FC<ReflectionProps> = () => {
  const classes = useStyles();

  return (
    <>
      <Heading>Reflect on your day</Heading>
      <TextArea label="Reflections" placeholder="Reflections: " />
    </>
  );
};

export default Reflection;