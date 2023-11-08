import { ComponentStyleConfig, extendTheme } from "@chakra-ui/react";

const components: { [key: string]: ComponentStyleConfig } = {
  Heading: {
    baseStyle: {
      fontWeight: 500,
      color: "#494949",
    },
    variants: {
      largeTitle: {
        color: "gray.900",
        fontWeight: 400,
        fontSize: "32px",
        lineHeight: 1.2,
      },
      largeTitleBold: {
        color: "gray.900",
        fontWeight: 700,
        fontSize: "32px",
        lineHeight: 1.2,
      },
      title: {
        fontWeight: 400,
        fontSize: "24px",
        lineHeight: 1.2,
      },
      titleBold: {
        fontWeight: 700,
        fontSize: "24px",
        lineHeight: 1.2,
      },
    },
  },
  Text: {
    variants: {
      body: { color: "gray.900", fontSize: "16px" },
      bodyBold: { color: "gray.900", fontWeight: "700", fontSize: "16px" },
      largeBody: {
        color: "gray.900",
        fontSize: "20px",
      },
      largeBodyBold: {
        color: "gray.900",
        fontWeight: "700",
        fontSize: "20px",
      },
      caption: {
        color: "gray.700",
        fontSize: "14px",
        lineHeight: "120%",
        fontWeight: "400",
      },
      captionBold: {
        color: "gray.900",
        fontSize: "14px",
        lineHeight: "120%",
        fontWeight: "700",
      },
    },
  },
  TagLabel: {
    baseStyle: {
      fontSize: "14px",
    },
  },
  Button: {
    baseStyle: {
      color: "#494949",
    },
    variants: {
      ghost: {
        justifyContent: "start",
        color: "gray.900",
        fontWeight: "700",
        _hover: {
          backgroundColor: "rgba(49, 115, 88, 0.14)",
          color: "brand.500",
        },
        _active: {
          backgroundColor: "rgba(49, 115, 88, 0.25)",
          color: "brand.500",
        }
      },
      brand: {
        padding: "8px 20px",
        borderRadius: "32px",
        color: "cream.300",
        background: "brand.500",
        fontSize: "16px",
        _hover: {
          color: "white",
          background: "brand.300",
          _disabled: {
            background: "brand.300",
          },
        },
        _active: {
          color: "white",
          background: "brand.300",
        },
      },
      brandInverted: {
        padding: "8px 20px",
        borderRadius: "32px",
        color: "brand.500",
        background: "cream.300",
        border: "1px solid",
        borderColor: "brand.500",
        fontSize: "16px",
        _hover: {
          background: "cream.500",
        },
        _active: {
          background: "cream.500",
        },
      },
      brandMono: {
        padding: "8px 20px",
        borderRadius: "32px",
        color: "gray.900",
        background: "white",
        border: "1px solid",
        borderColor: "gray.100",
        fontSize: "16px",
        _hover: {
          background: "gray.100",
        },
        _active: {
          background: "gray.200",
        },
      },
      link: {
        background: "none",
        border: "none",
        color: "blue.500",
        fontWeight: "700",
        display: "inline-flex",
        height: "auto",
        width: "auto",
        _hover: {
          background: "none",
          border: "none",
          fontStyle: "underline",
        },
      },
      altLink: {
        background: "none",
        border: "none",
        color: "gray.800",
        fontWeight: "700",
        display: "inline-flex",
        height: "auto",
        width: "auto",
        _hover: {
          background: "none",
          border: "none",
          fontStyle: "underline",
        },
      },
      cancelLink: {
        background: "none",
        border: "none",
        fontWeight: "700",
        color: "red.500",
        display: "inline",
        height: "auto",
        width: "auto",
        _loading: {
          display: "flex",
        },
        _hover: {
          background: "none",
          border: "none",
          fontStyle: "underline",
        },
      },
    },
  },
};

export const theme = extendTheme({
  colors: {
    red: {
      50: "rgb(235, 87, 87, 0.1)",
      100: "rgb(235, 87, 87, 0.2)",
      300: "rgb(235, 87, 87, 0.4)",
      400: "rgb(235, 87, 87, 0.6)",
      500: "rgba(235, 87, 87, 1)",
    },
    orange: {
      50: "rgba(242, 153, 74, 0.1)",
      100: "rgba(242, 153, 74, 0.2)",
      300: "rgba(242, 153, 74, 0.4)",
      400: "rgba(242, 153, 74, 0.6)",
      500: "rgba(242, 153, 74, 1)",
    },
    yellow: {
      50: "rgba(242, 201, 76, 0.1)",
      100: "rgba(242, 201, 76, 0.2)",
      300: "rgba(242, 201, 76, 0.4)",
      400: "rgba(242, 201, 76, 0.6)",
      500: "rgba(242, 201, 76, 1)",
    },
    green: {
      50: "rgba(39, 174, 96, 0.1)",
      100: "rgba(39, 174, 96, 0.2)",
      300: "rgba(39, 174, 96, 0.4)",
      400: "rgba(39, 174, 96, 0.6)",
      500: "rgba(39, 174, 96, 1)",
    },
    indigo: {
      50: "rgba(47, 128, 237, 0.1)",
      100: "rgba(47, 128, 237, 0.2)",
      300: "rgba(47, 128, 237, 0.4)",
      400: "rgba(47, 128, 237, 0.6)",
      500: "rgba(47, 128, 237, 1)",
    },
    sky: {
      50: "rgba(86, 204, 242, 0.1)",
      100: "rgba(86, 204, 242, 0.2)",
      300: "rgba(86, 204, 242, 0.4)",
      400: "rgba(86, 204, 242, 0.6)",
      500: "rgba(86, 204, 242, 1)",
    },
    purple: {
      50: "rgba(155, 81, 224, 0.1)",
      100: "rgba(155, 81, 224, 0.2)",
      300: "rgba(155, 81, 224, 0.4)",
      400: "rgba(155, 81, 224, 0.6)",
      500: "rgba(155, 81, 224, 1)",
    },
    black: "#494949",
    brand: {
      300: "#598c75",
      500: "#317358",
    },
    cream: {
      300: "#FAF1EB",
      500: "#ebded2",
      700: "#E9DCC9",
    },
    gray: {
      50: "#E1E1E1",
      100: "#DCDCDC",
      200: "#D6D6D6",
      300: "#C8C8C8",
      400: "#A5A5A5",
      500: "#888888",
      600: "#606060",
      700: "#4D4D4D",
      800: "#2F2F2F",
      900: "#101010",
    },
  },
  fonts: {
    body: '"work-sans", sans-serif',
    heading: '"work-sans", sans-serif',
  },
  components,
});
