const container = document.getElementById("__brk");
while (container.firstChild) {
  container.removeChild(container.lastChild);
}
const rootScript = Array.from(document.getElementsByTagName("script")).find(
  (script) => {
    return (
      script.text != undefined && script.text.includes("__dehydratedState")
    );
  }
);
eval(rootScript.text);
const bedrockData = JSON.parse(__dehydratedState);
const videos = bedrockData["layout"]["layouts"]["main"]["video"];
const videoId = Object.keys(videos)[0];
const video = videos[videoId];
const videoItems = video["blocks"][0]["content"]["items"];
const videoItem = videoItems.find((item) => item.itemType == "video");
const dashEncVideo = videoItem["video"]["assets"].find(
  (asset) => asset.format == "dashcenc" && asset.drm.type == "software"
);
const response = await fetch(dashEncVideo.path);
const videoPath = response.url;
const scriptElement = document.createElement("script");
scriptElement.onload = async () => {
  let token = undefined;
  let jwtToken = undefined;
  const jwtUrl =
    "https://front-auth.videoland.bedrock.tech/v2/platforms/m6group_web/getJwt";
  const jwtOptions = {
    method: "GET",
    headers: {
      "X-Auth-Device-Id": "__luid_d5b05fb5-2b87-42d4-a641-461dc6d247c3",
      "X-Auth-Token": "9f1a722ec72e7334a496c9849c9f2068c1211480",
      "X-Auth-Token-Timestamp": "1726124520",
    },
  };
  try {
    const response = await fetch(jwtUrl, jwtOptions);
    const data = await response.json();
    jwtToken = data.token;
  } catch (error) {
    console.error(error);
  }
  const videoTokenUrl = `https://drm.videoland.bedrock.tech/v1/customers/rtlnl/platforms/m6group_web/services/videoland/users/deviceid-_luid_d5b05fb5-2b87-42d4-a641-461dc6d247c3/videos/${videoId}/upfront-token`;
  const videoTokenOptions = {
    method: "GET",
    headers: { Authorization: `Bearer ${jwtToken}` },
  };
  try {
    const response = await fetch(videoTokenUrl, videoTokenOptions);
    const data = await response.json();
    token = data.token;
  } catch (error) {
    console.error(error);
  }
  const player = await window.foundation.ui.createPlayerUI(
    container,
    { playerType: "player-dashjs" },
    {}
  );
  player.setRequestHeaderCallback((_r) => ({ "x-dt-auth-token": token }));
  player.addEventListener("player:Error", console.error);
  await player.loadMedia({
    autoplay: true,
    type: "vod",
    manifests: [
      {
        type: "dashhd",
        sources: [{ url: videoPath, priority: "main", isYospace: false }],
        licenseServers: [
          {
            address: "https://lic.drmtoday.com/license-proxy-widevine/cenc/",
            encryptionType: "widevine",
          },
        ],
      },
    ],
  });
};
scriptElement.src =
  "https://cdn.player.foundation/ui/1.40.0-preview.11/bundle.js";
document.body.appendChild(scriptElement);
