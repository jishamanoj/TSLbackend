const currentTime = new Date();
            console.log("currentTime: " + currentTime);
            const otpTimestamp = new Date(user.otpTimestamp);
            console.log("otpTimestamp:",otpTimestamp);
            console.log("currentTime - otpTimestamp",currentTime - otpTimestamp);
            // Check if the OTP is still valid (within 2 minutes)
             if(currentTime - otpTimestamp <= 2 * 60 * 1000){
                console.log("true");
             }