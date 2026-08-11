import React from "react";

function Background() {
  return (
    <div className="fixed inset-0 z-[2] w-full h-screen pointer-events-none bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Animated grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-3xl" />

      <div className="absolute top-[5%] w-full text-center">
        <p className="text-sm font-light tracking-[0.3em] uppercase text-zinc-500">
          Documents
        </p>
      </div>

      <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] leading-none tracking-tighter font-black text-transparent bg-clip-text bg-gradient-to-r from-zinc-700 via-zinc-600 to-zinc-700 md:text-[40vw] select-none">
        Docs
      </h1>
    </div>
  );
}

export default Background;