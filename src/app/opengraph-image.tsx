import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "58px 68px",
          background:
            "linear-gradient(155deg, #0b1226 0%, #09090c 50%, #040406 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow orbs */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: "-60px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(207,156,58,0.16) 0%, transparent 68%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            right: "-40px",
            width: "380px",
            height: "380px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 68%)",
          }}
        />

        {/* Top hairline */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background:
              "linear-gradient(90deg, transparent, #CF9C3A, transparent)",
          }}
        />

        {/* Credential badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(224,169,60,0.10)",
            border: "1px solid rgba(224,169,60,0.30)",
            borderRadius: "100px",
            padding: "8px 22px",
            marginBottom: "26px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#E0A93C",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              color: "#F0CF85",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            National Wushu Medalist · Sports Psychologist · Athlete Mindset Coach
          </span>
        </div>

        {/* Main headline */}
        <div
          style={{
            fontSize: "60px",
            fontWeight: 900,
            lineHeight: 1.04,
            color: "#EFECE4",
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            marginBottom: "14px",
            maxWidth: "820px",
          }}
        >
          Train Your Mind Like a Warrior.
        </div>

        {/* Gold sub-line */}
        <div
          style={{
            fontSize: "32px",
            fontWeight: 800,
            color: "#CF9C3A",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            marginBottom: "36px",
          }}
        >
          Perform Like a Champion.
        </div>

        {/* Footer bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(224,169,60,0.18)",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <span
              style={{
                color: "#F0CF85",
                fontSize: "24px",
                fontWeight: 800,
                letterSpacing: "0.01em",
              }}
            >
              Kishore Kumar
            </span>
            <span
              style={{
                color: "rgba(239,236,228,0.45)",
                fontSize: "16px",
                letterSpacing: "0.04em",
              }}
            >
              Sports Psychology &amp; Martial Arts Coach · Chennai, India
            </span>
          </div>

          <div
            style={{
              background:
                "linear-gradient(135deg, #E6CF9C 0%, #CF9C3A 48%, #8E5F18 100%)",
              color: "#08080a",
              fontWeight: 800,
              fontSize: "15px",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              padding: "12px 28px",
              borderRadius: "100px",
            }}
          >
            kishorekumar.coach
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
