#!/usr/bin/env sh
case "$GITHUB_REF" in
  refs/tags/v*) TAG="${GITHUB_REF##*/}" ;;
  *) TAG=latest ;;
esac
echo "Docker Tag: $TAG"
echo "tag=$TAG" >> $GITHUB_OUTPUT
V_VERSION="$(git describe --tags)"
echo "Git Describe Version: $V_VERSION"
echo "v_version=$V_VERSION" >> $GITHUB_OUTPUT
VERSION="${V_VERSION#v}"
echo "version=$VERSION" >> $GITHUB_OUTPUT
