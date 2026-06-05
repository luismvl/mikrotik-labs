# RouterOS CHR Image for Containerlab

Containerlab supports MikroTik RouterOS with `kind: mikrotik_ros`, but the RouterOS CHR image must exist locally as a vrnetlab/QEMU container image.

The lab topologies expect this image:

```bash
vrnetlab/mikrotik_routeros:7.16
```

If Docker returns `pull access denied`, the platform and Containerlab are working, but the CHR image is missing.

## Verify

```bash
docker image inspect vrnetlab/mikrotik_routeros:7.16
```

## Build

Use the official MikroTik CHR image and the Containerlab-compatible `srl-labs/vrnetlab` workflow to build a local Docker image with the exact tag above.

```bash
mkdir -p ~/workspace/srl-vrnetlab-build
git clone https://github.com/srl-labs/vrnetlab.git ~/workspace/srl-vrnetlab-build/vrnetlab

cd ~/workspace/srl-vrnetlab-build/vrnetlab/mikrotik/routeros
wget https://download.mikrotik.com/routeros/7.16/chr-7.16.vmdk.zip
unzip -o chr-7.16.vmdk.zip
make IMAGE=chr-7.16.vmdk docker-build
```

The build creates:

```bash
vrnetlab/mikrotik_routeros:7.16-amd64
vrnetlab/mikrotik_routeros:7.16
```

Do not build this image from the old `vrnetlab/vrnetlab` repository for Containerlab labs. That image does not accept the `--hostname` and `--connection-mode` arguments passed by `kind: mikrotik_ros`.

Reference docs:

- Containerlab MikroTik RouterOS kind: https://containerlab.dev/manual/kinds/vr-ros/
- Containerlab VM-based routers integration: https://containerlab.dev/manual/vrnetlab/
- MikroTik CHR downloads: https://mikrotik.com/download/chr

After the image exists locally, run:

```bash
./scripts/start-lab.sh 001-basic-access
```

The Containerlab management network should be created as `mikrotik-labs-mgmt` with automatic subnets.
