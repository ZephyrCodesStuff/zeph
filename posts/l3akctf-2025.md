---
title: "l3akctf-2025.md"
date: "2025-07-12"
excerpt: "Write-up for the reverse engineering challenge I've solved"
---

# Androbro Challenge Writeup

**Time spent:** 9 hours — worth every minute! 💀

---

## Overview

This challenge involved reverse engineering an Android APK protected by a native C++ library with layered cryptographic techniques. The goal was to decrypt an encrypted Dalvik bytecode and ultimately recover the AES-encrypted flag.

---

## Step 1: Unpack and Decompile the APK

- Use tools like [`jadx`](https://github.com/skylot/jadx) to decompile the APK.
- Extract the native library from:  
  `lib/x86_64/libragnar.so`  
  > *Note:* The x86_64 version disassembles more reliably than other architectures.

---

## Step 2: Analyze the Native Library with IDA Pro

- Load `libragnar.so` into **IDA Pro** for disassembly.  
- Other disassemblers produced inconsistent or corrupted output, so IDA Pro was the best choice.

---

## Step 3: Locate Key JNI Functions

- Examine the `JNI_OnLoad` export to discover JNI interface functions.
- Identify a critical function at address `0x0049810` with the signature:  
  ```c
  _JNIEnv *jenv, __int64 a2, __int64 a3, __int64 a4
  ```
- This function drives the core cryptographic workflow.

---

## Step 4: Reverse Engineer Core Logic (starting at `0x68AC1`)

Key operations performed by this function:

1. **Extract the Package Name**  
   The app’s package name is retrieved: `com.defensys.androbro`

2. **Compute SHA256 Using Java APIs**  
- The package name is converted into a Java string.  
- A SHA256 digest is computed via Java’s `MessageDigest` class.

3. **Generate RC4 Key and Input**  
- The SHA256 digest is converted to its **hexadecimal ASCII** string representation.  
- This hex string serves as the **RC4 key**.  
- The **input** to the RC4 cipher is the ASCII bytes of the package name.

4. **Decrypt an Encrypted Asset**  
- The RC4 output is used as an XOR key to decrypt the file:  
  ```
  assets/E/M/O/H/G/CMVASFLW.EXE
  ```
- This decrypted file is actually a Dalvik Executable (DEX).

---

## Step 5: Analyze the Decompiled DEX

- Load the decrypted DEX into `jadx` or a similar tool.  
- Locate the class: `defpackage.FlagChecker`
- Focus on the method: `FlagChecker.checkFlag`
- This method contains an AES-encrypted flag and the corresponding parameters.

---

## Step 6: Decrypt the Flag

- The flag is encrypted using AES-CBC with PKCS5 padding.
- The key, IV, and ciphertext are all hardcoded Base64 strings in the Java class.
- Decrypting this yields the final flag.

---

## Final Flag
`L3AK{_Using_native_cpp__is_not_really_hard_xd_31412314}`
- Required XOR key for `CMVASFLW.EXE` (the Dalvik class): `6a209693a9acaf10dcd2e425bab62a5e48698b7fc3`

## Notes
The challenge authors recommend solving this challenge with Frida: a dynamic instrumentation toolkit for Android. However, I've had multiple issues getting Frida to work or to capture anything. The general idea would've been:
- Hook the library, particularly the `strcmp` functions, and print the arguments.
- The app would calculate the correct XOR key and compare it to your input.
- Use `adb` to send a Broadcast Intent to trigger the flag check (namely, `THE_TRIGER` (with the misspelling) and `THE_UNLOCKER`), so the app would calculate the XOR key and compare it to your input (taken from the Intent's extra argument `key`)

I've chosen to solve the challenge statically with IDA (The Interactive Disassembler) instead, because:
1. It's simply more fun (I enjoy static analysis much more).
2. Frida did not want to work (I've only got a jailed Android device, which I refuse to root), and `frida-gadget` was severely hindered.
3. The app seemed to completely ignore any and all messages I'd send via `adb shell am broadcast`.
4. The cryptography isn't complicated enough to force me to use other dynamic tools.

Additionally, IDA was the only disassembler that could handle the native library without issues, while others produced corrupted or incomplete outputs.
- BinaryNinja's output was extremely messy.
- Ghidra's output was much cleaner, but unreliable; it struggled to identify the `xorbuffers` function's arguments, making it appear as if it simply ignored one of the two. This made it impossible to figure what was being fed into RC4.
- It is to be noted that I used the `armv8` version of the lib for the first two, but switched to the `x86_64` version for IDA, which might've been what got IDA to work better with it.

To confirm the key was right, I bruteforced the first 8 Dalvik magic bytes, which are always `dex\n035\0`. This gave me the first 8 characters of the XOR key (`6a209693`). Decrypting the file with this key yielded a partially readable DEX file, which confirmed my approach was correct.