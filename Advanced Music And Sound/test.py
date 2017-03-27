import wave

if __name__ == "__main__":
    
    fileName = raw_input("Please enter \"your_file_name.wav\" to process: ")
    waveFile = wave.open(fileName,'r')
    
    
    